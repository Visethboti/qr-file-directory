import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class EmployeeService {
  private readonly storagePath = path.join(__dirname, '../..', 'storage');

  findAll(filter: Record<string, any>) {
    const { page, limit } = filter;
    try {
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

  async generateQRCode(fileName: string, url: string) {
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }

    const fileUrl = `${url}/storage/${fileName}`;
    const qrCodeDataUrl = await QRCode.toDataURL(fileUrl);

    return qrCodeDataUrl;
  }
}
