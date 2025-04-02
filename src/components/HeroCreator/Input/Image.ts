import {IInputComponent} from '@/type/templateDesigner';
import {IImageInputHandler} from '@boardmeister/antetype-conditions';

const handleFiles = (e: Event, inputComponent: IInputComponent): void => {
  const input = inputComponent.input as IImageInputHandler;
  const files = (e.target as HTMLInputElement).files ?? [];
  if (!files.length) {
    return;
  }
  const file = files[0]!;
  input.value = URL.createObjectURL(file);
}

export const handleImageInput = (inputComponent: IInputComponent): void => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.addEventListener('change', e => {
    handleFiles(e, inputComponent);
    const view = inputComponent.modules.core.view;
    void view.recalculate().then(() => {
      view.redraw();
    })
  }, true);
  fileInput.click();

}
