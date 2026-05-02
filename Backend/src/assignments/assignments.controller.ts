import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Req } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { GradeAssignmentDto } from './dto/grade-assignment.dt';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly submissionsService: AssignmentsService) {}

    @Post()
    async create(@Body() createSubmissionDto: CreateAssignmentDto, @Req() req: any) {
        const userId = req.user.id; 
        return await this.submissionsService.create(createSubmissionDto, userId);
    }

    @Get('task/:publicationId')
    async findByPublication(@Param('publicationId', ParseUUIDPipe) publicationId: string) {
        return await this.submissionsService.findByPublication(publicationId);
    }

    @Patch(':id/grade')
    async grade(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() gradeSubmissionDto: GradeAssignmentDto
    ) {
        return await this.submissionsService.grade(id, gradeSubmissionDto);
    }
}