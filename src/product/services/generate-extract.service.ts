import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import MongoAccountRepository from '../repositories/MongoAccountRepository';
import MongoTransactionRepository from 'src/transaction/repositories/MongoTransactionRepository';
import MongoUserRepository from 'src/user/repositories/MongoUserRepository';

enum Meses {
  Enero = 1,
  Febrero,
  Marzo,
  Abril,
  Mayo,
  Junio,
  Julio,
  Agosto,
  Septiembre,
  Octubre,
  Noviembre,
  Diciembre,
}

@Injectable()
export class GenerateExtractService {
  constructor(
    private readonly transactionRepositpory: MongoTransactionRepository,
    private readonly accountRepository: MongoAccountRepository,
    private readonly userRepository: MongoUserRepository,
  ) {}

  async use(id: string, res: any): Promise<StreamableFile> {
    // Crear un nuevo documento PDF

    const accountFound = await this.accountRepository.get(id);
    if (!accountFound) {
      throw new NotFoundException('La cuenta no existe.');
    }
    const jobs = await Promise.all([
      this.transactionRepositpory.getMovements(id),
      this.userRepository.get(accountFound.owner),
    ]);
    const user = jobs[1];
    if (!user) {
      throw new NotFoundException(
        'No existe un usuario asociado a esta cuenta.',
      );
    }

    const doc = new PDFDocument({ margin: 50 });
    // Configurar el flujo de salida hacia la respuesta HTTP
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=extract_${id}_${user.documentNumber}.pdf`,
    );
    doc.pipe(res);

    // Encabezado del PDF con estilo destacado
    doc
      .fontSize(22)
      .fillColor('black')
      .text('Extracto de cuenta', { align: 'center' });
    doc.moveDown(1);
    doc
      .fontSize(10)
      .fillColor('#666666')
      .text(`Fecha de Generación: ${new Date().toLocaleString()}`, {
        align: 'right',
      });
    doc.moveDown(1);
    doc.fillColor('black');
    // Información de la cuenta en un marco
    doc.roundedRect(50, doc.y, 500, 120, 5).stroke('#cccccc');

    doc.text(
      `Propietario: ${user.data.firstName} ${user.data.lastName} `,
      60,
      doc.y + 10,
    );
    doc.text(
      `Numero de documento: ${user.data.documentNumber}`,
      60,
      doc.y + 10,
    );
    doc.text(`Cuenta ID: ${id}`, 60, doc.y + 10);
    doc.text(
      `Saldo final: $${accountFound.balance.toLocaleString('es-CO')}`,
      60,
      doc.y + 10,
    );
    const currentDate = new Date();
    doc.text(
      `Periodo: ${Meses[currentDate.getUTCMonth() + 1]}`,
      60,
      doc.y + 10,
    );
    doc.moveDown(4);

    // Título de la tabla con un fondo de color
    const rowY = doc.y;
    doc.rect(50, rowY, 500, 20).fill('black').stroke();
    doc.fillColor('white').fontSize(12);
    doc.text('Descripcion', 60, rowY + 5, { width: 150, align: 'left' });
    doc.text(`Monto`, 190, rowY + 5, {
      width: 80,
      align: 'left',
    });
    doc.text('Fecha', 280, rowY + 5, {
      width: 150,
      align: 'left',
    });
    doc.text('ID', 410, rowY + 5, {
      width: 130,
      align: 'left',
    });

    doc.moveDown(1);

    let totalReceived = 0;
    let totalTransfered = 0;

    // Filas de movimientos alternando colores
    for (let i = jobs[0].length - 1; i >= 0; i--) {
      const t = jobs[0][i];
      const rowY = doc.y;
      const rowColor = i % 2 === 0 ? '#f2f2f2' : 'white';

      doc.rect(50, rowY, 500, 20).fill(rowColor).stroke();
      doc.fillColor('black').fontSize(10);
      doc.text(t.title, 60, rowY + 5, { width: 110, align: 'left' });

      if (t.amount > 0) {
        doc.fillColor('green');
        totalReceived += t.amount;
      } else {
        doc.fillColor('red');
        totalTransfered += t.amount;
      }
      doc.text(`$${t.amount.toLocaleString('es-CO')}`, 190, rowY + 5, {
        width: 80,
        align: 'left',
      });
      doc.fillColor('black');
      doc.text(new Date(t.createdAt).toLocaleString(), 280, rowY + 5, {
        width: 150,
        align: 'left',
      });
      doc.text(t.transactionId.toString(), 410, rowY + 5, {
        width: 130,
        align: 'left',
      });

      doc.moveDown();
    }
    const rowY_ = doc.y;

    doc
      .font('Helvetica-Bold')
      .fontSize(13)
      .text(`Total recibido:`, 60, rowY_ + 10);

    doc
      .fillColor('green')
      .font('Helvetica')
      .fontSize(13)
      .text(`$${totalReceived.toLocaleString('es-CO')}`, 170, rowY_ + 10);

    doc
      .fillColor('black')
      .font('Helvetica-Bold')
      .fontSize(13)
      .text(`Total transferido:`, 60, rowY_ + 25)
      .fillColor('black');
    doc
      .fillColor('red')
      .font('Helvetica')
      .fontSize(13)
      .text(`$${totalTransfered.toLocaleString('es-CO')}`, 170, rowY_ + 25);

    // Finalizar el documento
    doc.end();

    return new StreamableFile(res);
  }
}
