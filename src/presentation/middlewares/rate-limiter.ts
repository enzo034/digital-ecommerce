import rateLimit from 'express-rate-limit'; //todo: Se van a usar en caso de que el host no tenga este tipo de protección

// General rate-limiter (aplicado a todas las rutas)
export const generalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Máximo 100 solicitudes
    message: {
        error: 'Too many requests. Please try again after 15 minutes.',
    },
    standardHeaders: true, // Envia información de rate limit en los headers
    legacyHeaders: false, // Desactiva los headers 'X-RateLimit-*'
});

// Rate-limiter para rutas sensibles como login
export const loginRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 5, // Máximo 5 intentos
    message: {
        error: 'Too many login attempts. Please try again after 5 minutes.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate-limiter para APIs públicas
export const publicApiRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 60, // Máximo 60 solicitudes
    message: {
        error: 'API request limit exceeded. Try again after 1 minute.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate-limiter para rutas administrativas
export const adminRateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutos
    max: 10, // Máximo 10 solicitudes
    message: {
        error: 'Too many admin requests. Please wait 10 minutes before retrying.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
