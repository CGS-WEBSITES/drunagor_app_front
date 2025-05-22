import {IInputComponent} from '@/type/templateDesigner';
import {ISelectInputHandler} from '@boardmeister/antetype-conditions';

export const handleSelectInput = (inputComponent: IInputComponent): void => {
  const input = inputComponent.input as ISelectInputHandler
  const {origin: {button}} = inputComponent;
  const direction = button == 2;
  // @TODO this is a little messy, saved for refactoring later
  for (let i = 0; i < input.options.length; i++) {
    const option = input.options[i];
    if (!option.checked) {
      continue;
    }
    option.checked = false;
    if (!direction) {
      if (i + 1 < input.options.length) input.options[i + 1].checked = true;
      else input.options[0].checked = true;
    } else {
      if (i == 0) input.options.slice(-1)[0].checked = true;
      else input.options[i - 1].checked = true;
    }

    return;
  }
  if (!direction) input.options[0].checked = true;
  else input.options.slice(-1)[0].checked = true;
}
