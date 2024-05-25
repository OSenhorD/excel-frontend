interface IUserDTO {
  id: string
  name: string
  email: string
  password: string
  avatar?: string
  isAdmin: boolean
  isActive: boolean
}

export interface IUserListRes {
  id: string
  name: string
  email: string
  isAdmin: boolean
  isActive: boolean
  $selected?: boolean
}

export interface IUserCreateParam extends Omit<IUserDTO, "id"> { }

export interface IUserUpdateParam extends IUserDTO { }

export interface IUserGetRes extends Omit<IUserDTO, "password"> { }

export interface IListLiterals {
  title: string
  columns: {
    name: string
    email: string
    isAdmin: {
      label: string
      labels: {
        true: string
        false: string
      }
    }
    isActive: {
      label: string
      labels: {
        true: string
        false: string
      }
    }
  }
}

export interface IEditLiterals {
  page_edit: {
    title: string
  }
  form: {
    name: {
      label: string
      placeholder: string
    }
    email: {
      label: string
      placeholder: string
    }
    password: {
      label: string
      placeholder: string
    }
    avatar: {
      label: string
    }
    isAdmin: {
      label: string
    }
    isActive: {
      label: string
    }
  }
  api: {
    post: string
    put: string
  }
}
