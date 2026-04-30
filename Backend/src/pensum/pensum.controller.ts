import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PensumService } from './pensum.service';
import { CreatePensumDto } from './dto/create-pensum.dto';
import { UpdatePensumDto } from './dto/update-pensum.dto';

@Controller('pensum')
export class PensumController {
  constructor(private readonly pensumService: PensumService) {}

  @Post()
  create(@Body() createPensumDto: CreatePensumDto) {
    return this.pensumService.create(createPensumDto);
  }

  @Get()
  findAll() {
    return this.pensumService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pensumService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePensumDto: UpdatePensumDto) {
    return this.pensumService.update(+id, updatePensumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pensumService.remove(+id);
  }
}
