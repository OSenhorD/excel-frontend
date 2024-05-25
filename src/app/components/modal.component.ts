import {
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core"

@Component({
  selector: "custom-modal",
  standalone: true,
  templateUrl: "./modal.component.html",
})

export class ModalComponent {
  @Input("show-modal") showModal: boolean = false

  @Output("on-close") protected readonly onCloseEvent = new EventEmitter()
}
