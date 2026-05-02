import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseUUIDPipe } from '@nestjs/common';
import { CourseAssignmentService } from './course-assignment.service';
import { CreateAssignmentDto } from './dto/create-course-assignment.dto';

@Controller('course-assignment')
export class CourseAssignmentController {
  constructor(private readonly assignmentsService: CourseAssignmentService) {}

    @Post('enroll')
    async enroll(@Body() createAssignmentDto: CreateAssignmentDto, @Req() req: any) {
        return await this.assignmentsService.enroll(createAssignmentDto, req.user.id);
    }

    @Get('course/:courseId/students')
    async getStudents(@Param('courseId', ParseUUIDPipe) courseId: string) {
        return await this.assignmentsService.findStudentsByCourse(courseId);
    }

    @Get('my-assignments')
    async getMyAssignments(@Req() req: any) {
        return await this.assignmentsService.findMyCourses(req.user.id);
    }
}