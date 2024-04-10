const envSchema = {
    type: 'object',
    required: [
        'APP_NAME',
        'APP_SERVER_HOST',
        'APP_SERVER_PORT',
        'MODE',
        'MYSQL_PORT',
        'MYSQL_HOST',
        'MYSQL_PASSWORD',
        'MYSQL_USER',
        'MYSQL_DB_NAME'
    ],
    properties: {
        'APP_NAME': {
            type:'string'
        },
        'APP_SERVER_HOST': {
            type:'string'
        },
        'APP_SERVER_PORT': {
            type:'number'
        },
        'MODE': {
            type:'string',
            default:'development'
        },
        'MYSQL_PORT': {
            type: 'number',
            default: 3306
        },
        'MYSQL_HOST': {
            type: 'string'
        },
        'MYSQL_USER': {
            type: 'string'
        },
        'MYSQL_PASSWORD': {
            type: 'string'
        },
        'MYSQL_DB_NAME': {
            type: 'string'
        }

    }
};

export { envSchema };