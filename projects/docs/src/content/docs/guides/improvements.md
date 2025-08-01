---
title: Improvements & DRY Code
keyword: HelperPage
---

## Helper

To reduce the amount of boilerplate needed with each component and to improve maintainability, you can set up a few helper objects. This way, should anything change, you only need to update one file.

:::caution
Helper file names must exactly be `control-container.view-provider.ts` and `<type>.host-directive.ts`. Any deviation will result in the schematics not recognizing the files correctly and falling back to the verbose syntax.

The declarations within these files also have to be exact, otherwise you will end up with a broken import that you need to fix manually.
:::

### Manual Helper File Integration

- If you create helper files yourself, you can place them in any folder in your project.
- Run schematics with the `--helper` flag and use `--helperPath <path>` to point to your helper directory (default: `src/app/shared/helper`).
- The schematic will look in that path for files named exactly:
  - `control-container.view-provider.ts`
  - `control.host-directive.ts`
  - `group.host-directive.ts`
  - `block.host-directive.ts`

When running schematics, pass the flags to use your files:

```bash
ng generate ngx-formwork:<schematic> --helper --helperPath src/app/shared/helper
```

Or set these defaults in `angular.json` under your project’s `schematics` section:

```json
"ngx-formwork:control": { "helper": true, "helperPath": "src/app/shared/helper" },
```


### Control Container View Providers

`ControlContainer` is required for all controls and groups that will be used within _ngx-formwork_. Injection of the control container allows the components to use reactive forms functionality, without needing to pass the form group through inputs and wrapping the template into additional tags. See this YouTube Video for more detailed explanation: [How to Make Forms in Angular REUSABLE (Advanced, 2023)](https://www.youtube.com/watch?v=o74WSoJxGPI)

```ts title="control-container.view-provider.ts"
export const controlContainerViewProviders = [
  {
    provide: ControlContainer,
    useFactory: () => inject(ControlContainer, { skipSelf: true }),
  },
];
```

```ts title="text-control.component.ts || group.component.ts"
@Component({
  // Other component decorator options
  viewProviders: controlContainerViewProviders,
})
```

### Control Host Directive

This is a convenience helper to apply the `NgxfwControlDirective`.

```ts title="control.host-directive.ts"
export const ngxfwControlHostDirective = {
  directive: NgxfwControlDirective,
  inputs: ['content', 'name'],
};
```

Use it like this:

```ts title="text-control.component.ts"
@Component({
  // Other component decorator options
  hostDirectives: [
    // Apply here
    ngxfwControlHostDirective
  ],
})
```

### Group Host Directive

This is a convenience helper to apply the `NgxfwGroupDirective`.

```ts title="group.host-directive.ts"
export const ngxfwGroupHostDirective = {
  directive: NgxfwGroupDirective,
  inputs: ['content', 'name'],
};
```

Use it like this:

```ts title="group.component.ts"
@Component({
  // Other component decorator options
  hostDirectives: [
    // Apply here
    ngxfwGroupHostDirective
  ],
})
```

### Union Types

For official documentation of Union Types checkout the [official docs](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types).

Setting up a union type for your own controls is highly recommended, as it gives you much better type safety, when writing your forms in TypeScript.

```ts
export type MyAppControls = TestTextControl | TestGroup | InfoBlock;
```

## Code Splitting

Registering all controls. validators, etc. directly in the _app.config.ts_ is not ideal. Set up a dedicated file for your registrations.

### defineFormworkConfig

Create a file, next to your _app.config.ts_, with this content to get started. The `defineFormworkConfig` function is a helper, to get type support when defining the configuration in a separate file.

```ts title="formwork.config.ts"
import { defineFormworkConfig } from 'ngx-formwork';

export const formworkConfig = defineFormworkConfig({
  componentRegistrations: {
    // Component registrations go here
  },
  // validatorRegistrations are optional
  validatorRegistrations: {
    // Validator registrations go here
  },
  // asyncValidatorRegistrations are optional
  asyncValidatorRegistrations: {
    // Async Validator registrations go here
  },
});
```

In _app.config.ts_ use it like this

```ts title="app.config.ts"
import { formworkConfig } from './formwork.config.ts';

export const appConfig: ApplicationConfig = {
  providers: [
    // other providers
    provideFormwork(formworkConfig)
  ]
};
```


### Splitting Registrations

You can further split up the configuration, by having files specifically for your control and validator registrations. While it is recommended to have everything withing _formwork.config.ts_, in some case further splitting can be beneficial for clarity.

#### Controls Registration

Create a file with the following content, at whatever location makes sense.

```ts title="controls.registerations.ts"
export const componentRegistrations: ComponentRegistrationConfig = {
  'text-control': TextControlComponent,
  group: GroupComponent,
  info: InfoBlockComponent,
  // more regsitrations...
};
```

In _app.config.ts_ use it like this

```ts title="app.config.ts"
import { componentRegistrations } from './controls.registerations.ts';

export const appConfig: ApplicationConfig = {
  providers: [
    // other providers
    provideFormwork({
      componentRegistrations
    })
  ]
};
```

In _formwork.config.ts_ use it like this

```ts title="app.config.ts"
import { componentRegistrations } from './controls.registerations.ts';

export const formworkConfig = defineFormworkConfig({
  // other providers
  componentRegistrations,
});
```

#### Validators Registration

Create a file with the following content, at whatever location makes sense. You can also further split the files between sync and async validators

```ts title="validators.registerations.ts"
export const validatorRegistrations: ValidatorConfig<RegistrationRecord> = {
  'min-chars': [Validators.minLength(3)],
  letter: [letterValidator],
  combined: ['min-chars', Validators.required, 'letter'],
  'no-duplicates': [noDuplicateValuesValidator],
  'forbidden-letter-a': [forbiddenLetterAValidator],
};

export const asyncValidatorRegistrations: AsyncValidatorConfig<RegistrationRecord> = {
  async: [asyncValidator],
  'async-group': [asyncGroupValidator],
};
```

In _app.config.ts_ use it like this

```ts title="app.config.ts"
import { validatorRegistrations, asyncValidatorRegistrations } from './validators.registerations.ts';

export const appConfig: ApplicationConfig = {
  providers: [
    // other providers
    provideFormwork({
      validatorRegistrations,
      asyncValidatorRegistrations,
    })
  ],
};
```

In _formwork.config.ts_ use it like this

```ts title="formwork.config.ts"
import { componentRegistrations } from './controls.registerations.ts';

export const formworkConfig = defineFormworkConfig({
  // other providers
  componentRegistrations: {
    validatorRegistrations,
    asyncValidatorRegistrations,
  },
});
```

:::caution
Extracting the validator registrations means losing some of the type safety features. Specifically it won't be possible to get warnings when you misspell the key in a reference. It is therefore recommended to keep the validators directly in `defineFormworkConfig` or `provideFormwork` function call.

The following example shows the case where the reference to the `letter` validator is misspelled.
:::

```ts title="misspelled.validators.registerations.ts"
export const validatorRegistrations: ValidatorConfig<RegistrationRecord> = {
  letter: [letterValidator],
  // ⚠️ letter only spelled with one T. 
  // This will give an TS error in the provideFormwork function, but not in this case
  combined: [Validators.required, 'leter'], 
};
```
