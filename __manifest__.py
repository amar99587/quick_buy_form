{
    'name': "Quick Buy Form",
    'version': '1.0',
    'summary': 'Adds a quick buy form to the website product page for cash on delivery.',
    'author': "Laziri",
    'website': "Classewkhlas",
    'category': 'Website/Website',
    'depends': ['website_sale', 'sale'],
    'data': [
        'views/index.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            'quick_buy_form/static/src/scss/style.scss',
            'quick_buy_form/static/src/js/index.js',
        ],
    },
    'installable': True,
    'application': False,
    'auto_install': False,
    'license': 'LGPL-3',
}