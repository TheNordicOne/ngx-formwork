import { FormIntegrationHostComponent } from './integration-host/form-integration-host.component';
import { formworkProviders } from '../shared/provide-formwork';

describe('Form', () => {
  describe('content', () => {
    beforeEach(() => {
      cy.mount(FormIntegrationHostComponent, {
        providers: [formworkProviders],
        componentProperties: {
          formContent: [
            {
              id: 'first',
              type: 'test-text-control',
              label: 'First',
            },
            {
              id: 'second',
              type: 'test-text-control',
              label: 'Second',
            },
            {
              id: 'third',
              type: 'test-text-control',
              label: 'Third',
            },
            {
              id: 'fourth',
              type: 'test-text-control',
              label: 'Fourth',
            },
            {
              id: 'fifth',
              type: 'test-text-control',
              label: 'Fifth',
            },
          ],
        },
      });
    });

    it('should show all content based on the form config', () => {
      cy.getByTestId('control-first').should('exist');
      cy.getByTestId('control-second').should('exist');
      cy.getByTestId('control-third').should('exist');
      cy.getByTestId('control-fourth').should('exist');
      cy.getByTestId('control-fifth').should('exist');
    });
  });
});
