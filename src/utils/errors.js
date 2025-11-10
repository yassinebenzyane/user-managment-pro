export class AppError extends Error {
constructor(message, type = 'GENERAL') {
super(message);
this.name = this.constructor.name;
this.type = type;
}
}


export class ValidationError extends AppError {
constructor(message) { super(message, 'VALIDATION'); }
}


export class NotFoundError extends AppError {
constructor(message) { super(message, 'NOT_FOUND'); }
}


export class NetworkError extends AppError {
constructor(message) { super(message, 'NETWORK'); }
}