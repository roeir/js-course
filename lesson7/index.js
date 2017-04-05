const rp = require('request-promise');
const argv = require('yargs')
    .alias(
        {
            'u': 'username',
            's': 'sort',
            'd': 'direction',
            'h': 'help'
        }
    )
    .default({
        'u': 'me',
        's': 'full_name'
    })
    .describe({
        'u': 'Set a user name',
        's': 'Set a sort type',
        'd': 'Set a direction type',
        'h': 'Show help'
    })
    .choices({
        's': ['created', 'updated', 'pushed', 'full_name'],
        'd': ['asc', 'desc']
    })
    .help('h')
    .argv;

const token = '3d72ecee7525a316808130a68527e70fac4d66e1';
const url = 'https://api.github.com';

const getUser = userName => {
    const userPath = (argv.username === 'me')?
        `/user`:
        `/users/${argv.username}`;

    const options = {
        uri: url + userPath,
        qs: {
            access_token: token,
        },
        headers: {
            'User-Agent': 'Request-Promise',
        },
        json: true
    };
    return rp(options);
};

const getUserRepo = user => {
    const userPath = (argv.username === 'me')?
        `/user`:
        `/users/${user.login}`;

    const options = {
        uri: url + userPath + `/repos`,
        qs: {
            access_token: token,
            sort: argv.sort,
            direction: argv.direction
        },
        headers: {
            'User-Agent': 'Request-Promise',
        },
        json: true
    };

    return rp(options);
};

const showUserRepo = repos => {
    console.log('User Repositories:');
    repos.forEach(repo => {
        console.log(repo.full_name);
    });
};

getUser(argv.username)
    .then(getUserRepo)
    .then(showUserRepo)
    .catch(err => {
        console.log(err.message);
    });