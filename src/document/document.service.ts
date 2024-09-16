import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class DocumentService {
  private readonly storagePath = path.join(__dirname, '../..', 'storage');

  findAll(filter: Record<string, any>) {
    const { page, limit } = filter;
    try {
      console.log(this.storagePath);

      const files = fs.readdirSync(this.storagePath);
      const totalFiles = files.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      if (startIndex >= totalFiles) {
        return {
          message: 'No files found for the given page',
        };
      }

      const paginatedFiles = files.slice(startIndex, endIndex);

      return {
        totalFiles,
        totalPages: Math.ceil(totalFiles / limit),
        currentPage: page,
        files: paginatedFiles,
      };
    } catch (error) {
      return { hello: error };
    }
  }
  // async findOne(token: string): Promise<Buffer> {
  //   const document = await this.documentRepository.findOne({
  //     where: { accessToken: token },
  //   });
  //   if (!document) {
  //     return null;
  //   }
  //   const newToken = crypto.randomBytes(20).toString('hex');
  //   const downloadUrl = `http://localhost:3000/document/${newToken}`;
  //   const newQrCode = await QRCode.toDataURL(downloadUrl);
  //   document.accessToken = newToken;
  //   document.qrCode = newQrCode;
  //   await this.documentRepository.save(document);
  //   return document.file;
  // }
  // update(id: number, updateDocumentDto: UpdateDocumentDto) {
  //   return `This action updates a #${id} document`;
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} document`;
  // }

  async generateQRCode(fileName: string) {
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }

    const fileUrl = `http://localhost:3000/storage/${fileName}`;

    const qrCodeDataUrl = await QRCode.toDataURL(fileUrl);

    // const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');
    // const buffer = Buffer.from(base64Data, 'base64');

    // // Save the buffer to a file
    // const filePath = path.join(this.storagePath, fileName);
    // fs.writeFileSync(filePath, buffer);

    return qrCodeDataUrl;
  }
}
