import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';

@Injectable()
export class SessionsService {
  constructor(@InjectRepository(Session) private readonly sessionRepository: Repository<Session>) {}

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    const newSession = this.sessionRepository.create(createSessionDto);
    return await this.sessionRepository.save(newSession);
  }

  async findAll(): Promise<Session[]> {
    return await this.sessionRepository.find({
      relations: ['user'],
      order: { startDate: 'DESC' }
    });
  }

  findOne(id: string) {
    return `This action returns a #${id} session`;
  }

  update(id: string, updateSessionDto: UpdateSessionDto) {
    return `This action updates a #${id} session`;
  }

  async remove(id: string): Promise<void> {
    const session = await this.sessionRepository.findOne({ where: { id } });
    if (!session) throw new NotFoundException('Sesión no encontrada');
    await this.sessionRepository.remove(session);
  }

  async findByToken(token: string): Promise<Session> {
    const session = await this.sessionRepository.findOne({ 
      where: { sessionToken: token },
      relations: ['user']
    });
    if (!session) throw new NotFoundException('Sesión no válida');
    return session;
  }
}
