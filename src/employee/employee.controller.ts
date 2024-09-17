import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
  Param,
  HttpException,
  Req,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { randomBytes } from 'crypto';
import { Request } from 'express';

@Controller('employee')
export class EmployeeController {
  private readonly password: string;

  constructor(private readonly employeeService: EmployeeService) {
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
          const randomText = randomBytes(16).toString('hex');
          const fileName = `${randomText}-${file.originalname}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  async create(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const protocol = req.protocol;
    const host = req.get('host');
    const url = `${protocol}://${host}`;
    const qrCode = await this.employeeService.generateQRCode(
      file.filename,
      url,
    );
    return `<img src="${qrCode}" alt="QR Code" />`;
  }

  @Get()
  findAll(@Query() filter: object) {
    return this.employeeService.findAll(filter);
  }

  @Get(':fileName')
  async findOne(@Req() req: Request, @Param('fileName') fileName: string) {
    try {
      const protocol = req.protocol;
      const host = req.get('host');
      const url = `${protocol}://${host}`;
      const qrCode = await this.employeeService.generateQRCode(fileName, url);

      return `<img src="${qrCode}" alt="QR Code" />`;
    } catch (error) {
      throw new HttpException('Employee not found', error);
    }
  }
}
