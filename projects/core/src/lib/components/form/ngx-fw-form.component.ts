import { Component, inject, input } from '@angular/core';
import { NgxFwContent } from '../../types/content.type';
import { ComponentRegistrationService } from '../../services/component-registration.service';
import { FormService } from '../../services/form.service';
import { controlContainerViewProviders } from '../../helper/control-container-view-providers';
import { NgxfwAbstractControlDirective } from '../../directives/ngxfw-abstract-control.directive';

/**
 * Ngx Formwork Form Component
 *
 * This component serves as the main container for Ngx Formwork forms:
 * - Takes an array of form content configuration objects
 * - Establishes the form context through FormService provider
 * - Renders each content item using NgxfwAbstractControlDirective
 * - Handles component registration and dependency injection
 *
 * The component acts as the root element for declarative form creation,
 * processing the form content configuration and rendering the appropriate
 * components for each control defined in the configuration.
 */
@Component({
  selector: 'ngxfw-form',
  imports: [NgxfwAbstractControlDirective],
  templateUrl: './ngx-fw-form.component.html',
  providers: [FormService],
  viewProviders: [controlContainerViewProviders],
})
export class NgxFwFormComponent {
  /**
   * Service for component registration
   * Provides access to component type mappings
   */
  private readonly contentRegistrationService = inject(
    ComponentRegistrationService,
  );

  /**
   * Registration map of component types
   * Maps control types to component implementations
   */
  readonly registrations = this.contentRegistrationService.registrations;

  /**
   * Required input containing form content configuration
   * An array of content objects defining the form structure
   */
  readonly formContent = input.required<NgxFwContent[]>();
}
