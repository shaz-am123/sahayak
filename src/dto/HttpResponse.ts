class HttpResponse {
  status: number;
  body: object;

  constructor(status: number, body: object) {
    this.status = status;
    this.body = body;
  }
}

export default HttpResponse;
