import { ContentHostComponent } from './content-host.component';
import {
  TestTextControl,
  UnknownContent,
} from '../../../test/types/controls.type';
import { TestGroup } from '../../../test/types/group.type';
import { registrations } from '../../../test/helper/registrations';

describe('Content Host Component', () => {
  it('should create the component', () => {
    const content: UnknownContent = {
      id: 'some-group',
      type: 'unknown',
      label: 'Unkown',
    };

    cy.mount(ContentHostComponent, {
      componentProperties: {
        content,
        registrations,
      },
    });
  });

  describe('content types', () => {
    it('uses content type group', () => {
      const content: TestGroup = {
        id: 'some-group',
        type: 'test-group',
      };

      cy.mount(ContentHostComponent, {
        componentProperties: {
          content,
          registrations,
        },
      });
      cy.getByTestId('group-some-group').should('exist');
    });

    it('uses content type control', () => {
      const content: TestTextControl = {
        id: 'some-control',
        type: 'test-text-control',
        label: 'Some Control',
      };

      cy.mount(ContentHostComponent, {
        componentProperties: {
          content,
          registrations,
        },
      });
      cy.getByTestId('control-some-control').should('exist');
    });
  });
});
