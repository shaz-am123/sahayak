class HttpResponse {
  statusCode: number;
  body: object;

  constructor(data: { statusCode: number; body: object }) {
    this.statusCode = data.statusCode;
    this.body = data.body;
  }
}

export default HttpResponse;
