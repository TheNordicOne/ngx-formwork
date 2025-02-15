import { RegistrationIntegrationHostComponent } from './integration-host/registration-integration-host.component';
import { provideFormwork } from '../../../lib';
import { TestTextControlComponent } from '../../components/test-text-control/test-text-control.component';
import { TestGroupComponent } from '../../components/test-group/test-group.component';

describe('Content Registration', () => {
  it('should show registered content', () => {
    cy.mount(RegistrationIntegrationHostComponent, {
      providers: [
        provideFormwork(
          {
            type: 'test-text-control',
            component: TestTextControlComponent,
          },
          {
            type: 'test-group',
            component: TestGroupComponent,
          },
        ),
      ],
      componentProperties: {
        content: {
          type: 'test-text-control',
          id: '',
        },
      },
    });

    cy.getByTestId('control').should('exist');
  });
});
