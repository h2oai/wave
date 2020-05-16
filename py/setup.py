import setuptools

with open('README.md', 'r') as readme:
    long_description = readme.read()

setuptools.setup(
    name='telesync',  
    version='0.1.0',
    author='Prithvi Prabhu',
    author_email='prithvi@h2o.ai',
    description='Python driver for H2O Q Realtime Apps',
    long_description=long_description,
    url='https://h2o.ai',
    packages=setuptools.find_packages(),
    classifiers=[
        'Programming Language :: Python :: 3',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
    ],
    install_requires=[
        'requests',
        'websockets'
    ],
)
