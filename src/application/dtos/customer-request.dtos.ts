export class CustomerRequestDto {
  name: string;
  email: string;
  phone: string;

  constructor() {
    this.name = "";
    this.email = "";
    this.phone = "";
  }
}