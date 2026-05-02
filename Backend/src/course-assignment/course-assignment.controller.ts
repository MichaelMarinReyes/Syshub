import { Controller, Post, Get, Body, Param, ParseUUIDPipe, Req, UseGuards } from '@nestjs/common';
import { CourseAssignmentsService } from './course-assignment.service';
import { CreateAssignmentDto } from './dto/create-course-assignment.dto';

@Controller('assignments')
export class CourseAssignmentsController {
    constructor(private readonly assignmentsService: CourseAssignmentsService) {}

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