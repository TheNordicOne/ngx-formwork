Here is an example of a simple group. Most likely you will only set up one or two group components, if at all.

First create an interface for your group.

```ts title="group.type.ts"
export interface Group extends NgxFwFormGroup {
  // Unique Key of your group that is used for differentiating groups
  type: 'group';

  // Additional options only applicable to this group if you want
}
```

Then implement the component.

:::caution
Be sure to bind to `[formGroupName]` on an element (e.g. div, ng-container)
:::

```ts title="group.component.ts"  group="group-minimal"
@Component({
  selector: 'ngxfw-group',
  imports: [NgxfwAbstractControlDirective, ReactiveFormsModule],
  templateUrl: './group.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  hostDirectives: [
    {
      directive: NgxfwGroupDirective,
      inputs: ['content', 'name'],
    }
  ],
})
export class GroupComponent {
  // Inject the Directive to gain access to all public properties
  // Make sure to pass the correct type parameter to get proper type information
  private readonly control = inject(NgxfwGroupDirective<Group>);
  
  // Explicitly setting a type definition is not required, but some IDEs work better if they are present
  readonly content: Signal<Group> = this.control.content;  // The configuration object of the group instance
  readonly name: Signal<string> = this.control.name;
  readonly controls: Signal<[string, NgxFwContent][]> = this.control.controls;
}
```

```html title="group.component.html" group="group-minimal"
<!-- Just an example -->
<div [formGroupName]="name()">
  @for (content of controls(); track content[0]) {
    <ng-template *ngxfwAbstractControl="content" />
  }
</div>
```

Finally, register the group in _app.config.ts_

```ts title="app.config.ts"
export const appConfig: ApplicationConfig = {
  providers: [
    // other providers
    provideFormwork({
      componentRegistrations: {
        group: GroupComponent
      }
    })
  ],
};
```
