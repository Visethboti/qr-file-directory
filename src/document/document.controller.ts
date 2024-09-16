import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
  Param,
  HttpException,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { diskStorage } from 'multer';

@Controller('document')
export class DocumentController {
  private readonly password: string;

  constructor(private readonly documentService: DocumentService) {
    const storagePath = './storage';
    if (!fs.existsSync(storagePath)) {
      fs.mkdirSync(storagePath);
    }
    this.password = process.env.PASSWORD;
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './storage',
        filename: (req, file, callback) => {
          const fileName = `${Date.now()}-${file.originalname}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  async create(@UploadedFile() file: Express.Multer.File) {
    const qrCode = await this.documentService.generateQRCode(file.filename);
    return `<img src="${qrCode}" alt="QR Code" />`;
  }

  @Get()
  findAll(@Query() filter: object) {
    return this.documentService.findAll(filter);
  }

  @Get(':fileName')
  async findOne(@Param('fileName') fileName: string) {
    try {
      const qrCode = await this.documentService.generateQRCode(fileName);

      return `<img src="${qrCode}" alt="QR Code" />`;
    } catch (error) {
      throw new HttpException('Document not found', error);
    }
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateDocumentDto: UpdateDocumentDto,
  // ) {
  //   return this.documentService.update(+id, updateDocumentDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.documentService.remove(+id);
  // }
}
