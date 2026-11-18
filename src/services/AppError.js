// Error de negocio con código HTTP sugerido (el servicio no conoce req/res).
class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

module.exports = AppError;
