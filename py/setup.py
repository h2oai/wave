import setuptools

with open('README.rst', 'r') as readme:
    long_description = readme.read()

setuptools.setup(
    name='telesync',
    version='0.0.3',
    author='Prithvi Prabhu',
    author_email='prithvi@h2o.ai',
    description='Python driver for H2O Q / Telesync Realtime Apps',
    long_description=long_description,
    url='https://h2o.ai',
    packages=setuptools.find_packages(),
    classifiers=[
        'Programming Language :: Python :: 3',
        'Operating System :: OS Independent',
        'Development Status :: 1 - Planning',
        'Intended Audience :: Developers',
        'License :: Other/Proprietary License',
        'Topic :: Database',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
        'Topic :: Communications :: Chat',
    ],
    python_requires='>=3.6',
    install_requires=[
        'tornado'
    ],
)
