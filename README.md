# MnmWebappApp

This project uses [Angular](https://angular.io/) version 17.0.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Cypress](https://www.cypress.io/).

## Library

The project includes a library called `mnm-webapp` which can be built with `ng build mnm-webapp`.

## Angular 17 Features

This project has been updated to use Angular 17 features including:

- Standalone components
- Modern dependency injection with inject()
- Improved subscription management with takeUntilDestroyed
- Modern component creation without ComponentFactoryResolver
- OnPush change detection for better performance
- New control flow syntax (@if, @for) replacing NgIf and NgFor directives
- Signal-based state management for reactive applications
- Deferrable views for improved performance and lazy loading
- Cypress for end-to-end testing

## Update History

The project was updated from Angular 10.2.1 to Angular 17.0.0 with the following changes:

- Updated all Angular packages to version 17.0.0
- Updated RxJS to version 7.8.1
- Updated TypeScript to version 5.4.3
- Converted components to standalone components
- Updated the build configuration to use the new Angular CLI format
- Replaced Protractor with Cypress for end-to-end testing
- Removed deprecated APIs and patterns

Further enhancements were made to leverage Angular 17's latest features:

- Replaced NgIf and NgFor directives with the new control flow syntax (@if, @for)
- Implemented signal-based state management for reactive applications
- Added deferrable views for improved performance and lazy loading
- Used modern dependency injection with inject() function
- Improved subscription management with takeUntilDestroyed

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
