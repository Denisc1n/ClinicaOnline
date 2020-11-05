import {
  trigger,
  transition,
  style,
  query,
  group,
  animateChild,
  animate,
} from '@angular/animations';

export const slideInAnimation = trigger('routeAnimations', [
  transition('Administrador <=> Registrar-admin', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }),
    ]),
    query(':enter', [style({ left: '100%' })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [animate('1000ms ease-out', style({ left: '100%' }))]),
      query(':enter', [animate('1000ms ease-out', style({ left: '0%' }))]),
    ]),
    query(':enter', animateChild()),
  ]),
  transition('Login => Administrador', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height: '100%',
      }),
    ]),
    query(':enter', [style({ right: '-100%' })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [animate('1000ms ease-out', style({ right: '100%' }))]),
      query(':enter', [animate('1000ms ease-out', style({ right: '0%' }))]),
    ]),
    query(':enter', animateChild()),
  ]),
  transition('Administrador => Login', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height: '100%',
      }),
    ]),
    query(':enter', [style({ right: '100%' })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [animate('1000ms ease-out', style({ right: '-100%' }))]),
      query(':enter', [animate('1000ms ease-out', style({ right: '0%' }))]),
    ]),
    query(':enter', animateChild()),
  ]),
  transition('Principal => Login', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height: '100%',
      }),
    ]),
    query(':enter', [style({ transform: 'translateY(1000px)' })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [
        animate('1000ms ease-out', style({ transform: 'translateY(-1000px)' })),
      ]),
      query(':enter', [
        animate('1000ms ease-out', style({ transform: 'translateY(0px)' })),
      ]),
    ]),
    query(':enter', animateChild()),
  ]),
  transition('Login => Principal', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height: '100%',
      }),
    ]),
    query(':enter', [style({ transform: 'translateY(-1000px)' })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [
        animate('1000ms ease-out', style({ transform: 'translateY(1000px)' })),
      ]),
      query(':enter', [
        animate('1000ms ease-out', style({ transform: 'translateY(0px)' })),
      ]),
    ]),
    query(':enter', animateChild()),
  ]),
  transition('Login <=> Registro', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height: '100%',
      }),
    ]),
    query(':enter', [style({ top: '-100%' })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [animate('1000ms ease-out', style({ top: '100%' }))]),
      query(':enter', [animate('1000ms ease-out', style({ top: '0' }))]),
    ]),
    query(':enter', animateChild()),
  ]),
  transition('Principal <=> Administrar-horarios', [
    style({
      right: '-400%',

      backgroundColor: 'rgba(0, 0, 0, 0)',
    }),
    animate(
      '.5s ease-in-out',
      style({
        right: 0,
        backgroundColor: 'blueviolet',
      })
    ),
    query(':enter', animateChild()),
  ]),
  //   transition('Login <=> Administrador', [
  //     style({ position: 'relative' }),
  //     query(':enter, :leave', [
  //       style({
  //         position: 'absolute',
  //         top: 0,
  //         right: 0,
  //         width: '100%',
  //         height: '100%',
  //       }),
  //     ]),
  //     query(':enter', [style({ top: '100%' })]),
  //     query(':leave', animateChild()),
  //     group([
  //       query(':leave', [animate('1000ms ease-out', style({ top: '-100%' }))]),
  //       query(':enter', [animate('1000ms ease-out', style({ top: '0' }))]),
  //     ]),
  //     query(':enter', animateChild()),
  //   ]),
]);
