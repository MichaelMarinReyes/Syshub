import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StatusesModule } from './statuses/statuses.module';
import { PensumModule } from './pensum/pensum.module';
import { TechnicalAreaModule } from './technical-area/technical-area.module';
import { LabelsModule } from './labels/labels.module';
import { TechnologiesModule } from './technologies/technologies.module';
import { CourseModule } from './course/course.module';
import { CourseAuxiliaryModule } from './course-auxiliary/course-auxiliary.module';
import { SessionsModule } from './sessions/sessions.module';
import { PublicationsModule } from './publications/publications.module';
import { ProjectsModule } from './projects/projects.module';
import { PostForumsModule } from './post_forums/post_forums.module';
import { BlogArticlesModule } from './blog_articles/blog_articles.module';
import { CommentsModule } from './comments/comments.module';
import { ReportsModule } from './reports/reports.module';
import { CourseAssignmentModule } from './course-assignment/course-assignment.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { TechnologyProjectModule } from './technology_project/technology_project.module';
import { TagPublicationsModule } from './tag_publications/tag_publications.module';

@Module({
  imports: [
    ConfigModule.forRoot ({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT!, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
    }),
    RolesModule,
    AuthModule,
    UsersModule,
    StatusesModule,
    PensumModule,
    TechnicalAreaModule,
    LabelsModule,
    TechnologiesModule,
    CourseModule,
    CourseAuxiliaryModule,
    SessionsModule,
    PublicationsModule,
    ProjectsModule,
    PostForumsModule,
    BlogArticlesModule,
    CommentsModule,
    ReportsModule,
    CourseAssignmentModule,
    AssignmentsModule,
    TechnologyProjectModule,
    TagPublicationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
