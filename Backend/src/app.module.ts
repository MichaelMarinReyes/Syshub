import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { RolesModule } from './roles/roles.module';
import { StatusesModule } from './statuses/statuses.module';
import { AuthModule } from './auth/auth.module';
import { ReportsModule } from './reports/reports.module';
import { PublicationsModule } from './publications/publications.module';
import { PensumModule } from './pensum/pensum.module';
import { TechnicalAreaModule } from './technical-area/technical-area.module';
import { CourseModule } from './course/course.module';
import { BlogArticlesModule } from './blog_articles/blog_articles.module';
import { CommentsModule } from './comments/comments.module';
import { LabelsModule } from './labels/labels.module';
import { PostForumsModule } from './post_forums/post_forums.module';
import { TechnologyProjectModule } from './technology_project/technology_project.module';
import { ProjectsModule } from './projects/projects.module';
import { SessionsModule } from './sessions/sessions.module';
import { TechnologiesModule } from './technologies/technologies.module';
import { Publication } from './publications/entities/publication.entity';
import { Label } from './labels/entities/label.entity';
import { AssignmentsModule } from './assignments/assignments.module';
import { CourseAssignmentModule } from './course-assignment/course-assignment.module';

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
    UsersModule,
    RolesModule,
    StatusesModule,
    AuthModule,
    ReportsModule,
    PublicationsModule,
    PensumModule,
    TechnicalAreaModule,
    CourseModule,
    BlogArticlesModule,
    CommentsModule,
    LabelsModule,
    PostForumsModule,
    TechnologyProjectModule,
    ProjectsModule,
    SessionsModule,
    TechnologiesModule,
    AssignmentsModule,
    CourseAssignmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
