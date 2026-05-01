import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRoleUpdateDto } from './dto/update-role.dto';
import { UserStatusUpdateDto } from './dto/update-status.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  create(@Body() CreateUserDto: CreateUserDto) {
    return this.usersService.create(CreateUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch(':id/role')
  async updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() roleDto: UserRoleUpdateDto,
  ) {
    try {
      return await this.usersService.updateUserRole(id, roleDto.roleId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: UserStatusUpdateDto,
  ) {
    try {
      return await this.usersService.updateUserStatus(id, statusDto.statusId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
