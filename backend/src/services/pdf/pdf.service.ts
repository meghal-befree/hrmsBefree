import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const PDFDocument = require('pdfkit');
import { User } from '../../entities/user.entity';

@Injectable()
export class PdfService {
  async generatePdf(users: User[]): Promise<Buffer> {
    const doc = new PDFDocument();
    const buffers: Uint8Array[] = [];

    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => {});

    // Table headers
    doc.fontSize(16).text('User List', { align: 'center' });
    doc.moveDown();

    const tableTop = doc.y;
    const itemSpacing = 20;
    const columnWidths = [50, 200, 250]; // adjust as needed

    doc
      .fontSize(12)
      .text('No.', 50, tableTop)
      .text('Username', 100, tableTop)
      .text('Email', 300, tableTop);

    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(); // horizontal line

    // Table rows
    let y = doc.y + 5;
    users.forEach((user, index) => {
      doc
        .fontSize(10)
        .text(index + 1, 50, y)
        .text(user.username, 100, y)
        .text(user.email, 300, y);

      y += itemSpacing;

      // Optional: draw lines between rows
      doc
        .moveTo(50, y - 5)
        .lineTo(550, y - 5)
        .strokeColor('#ccc')
        .stroke();
    });

    doc.end();

    return new Promise((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
    });
  }
}
