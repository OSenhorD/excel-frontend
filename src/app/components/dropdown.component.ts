import { Component, Input } from "@angular/core"

@Component({
  selector: "custom-dropdown",
  standalone: true,
  templateUrl: "./dropdown.component.html",
})

export class DropdownComponent {
  @Input("show-dropdown") dropdown: boolean = false

  protected showDropdown = () => {
    this.dropdown = !this.dropdown

    const closeOutside = (event: any) => {
      event.preventDefault()

      if (event?.target?.id == "box" || event?.target?.tagName == "BODY") {
        this.showDropdown()
        event.target?.removeEventListener("click", closeOutside)
      }
    }

    if (this.dropdown) {
      document.body.addEventListener("click", closeOutside)
    }
  }
}
