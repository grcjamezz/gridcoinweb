import logging.config

logging.config.dictConfig(
    {
        'version': 1,
        'disable_existing_loggers': False,
        'formatters': {
            'simple': {
                'format': '%(asctime)s - %(name)s - %(filename)s:%(lineno)d - %(levelname)s - %(message)s'
            }
        },

        'handlers': {
            'console': {
                'class': 'logging.StreamHandler',
                'level': 'DEBUG',
                'formatter': 'simple',
                'stream': 'ext://sys.stdout'
            },
        },

        'loggers': {
            'urllib3.connectionpool': {
                'level': 'ERROR'
            },
            'requests.packages.urllib3.connectionpool': {
                'level': 'ERROR'
            }
        },

        'root': {
            'level': 'DEBUG',
            'handlers': ['console']
        }
    })
