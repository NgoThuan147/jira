import httpService from "src/app/utils/httpconfig";

export default class ProductApi {
  constructor(private model: string, private http: httpService ) {}

  getProduct() {
    return this.http.get(`auths/profile`);
  }
}
