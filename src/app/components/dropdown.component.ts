import {
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core"

@Component({
  selector: "custom-dropdown",
  standalone: true,
  templateUrl: "./dropdown.component.html",
})

export class DropdownComponent {
  @Input("show-dropdown") dropdown: boolean = false
  @Output("on-open") onOpenEvent = new EventEmitter<void>()

  protected showDropdown = () => {
    this.dropdown = true

    const closeOutside = (event: any) => {
      event.preventDefault()

      if (event?.target?.id == "box" || event?.target?.tagName == "BODY") {
        event.target?.removeEventListener("click", closeOutside)
        this.dropdown = false
      }
    }

    if (this.dropdown) {
      document.body.addEventListener("click", closeOutside)
      this.onOpenEvent.emit()
    }
  }
}
