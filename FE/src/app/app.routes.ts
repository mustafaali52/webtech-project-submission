import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { TeacherGuard } from './shared/guards/teacher.guard';
import { StudentGuard } from './shared/guards/student.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./attempt/getmarks/getmarks.component').then(m => m.GetmarksComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./auth/register/register.component').then(m => m.SignupComponent)
    },
    {
        path: 'unauthorize',
        loadComponent: () => import('./unauthorize/unauthorize.component').then(m => m.UnauthorizeComponent)
    },
    {
        path: 'createquiz',
        loadComponent: () => import('./quiz/create.quiz/create.quiz.component').then(m => m.QuizCreateComponent),
        canActivate: [AuthGuard, TeacherGuard]
    },
    {
        path: 'takequiz',
        loadComponent: () => import('./attempt/attempt.quiz/attempt.quiz.component').then(m => m.StudentQuizComponent),
        canActivate: [AuthGuard, StudentGuard]
    },
    {
        path: 'history',
        loadComponent: () => import('./attempt/getmarks/getmarks.component').then(m => m.GetmarksComponent),
        canActivate: [AuthGuard, StudentGuard]
    }
];
