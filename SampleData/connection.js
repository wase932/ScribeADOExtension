`{
    status: 201,
    statusText: 'Created',
    headers: {
      date: 'Wed, 08 Apr 2020 03:47:03 GMT',
      'content-type': 'application/json; charset=utf-8',
      'content-length': '103',
      connection: 'close',
      'cache-control': 'no-store,no-cache',
      pragma: 'no-cache',
      expires: '-1',
      location: 'https://api.scribesoft.com/v1/orgs/...',
      server: '',
      'x-powered-by': '',
      'x-xss-protection': '1; mode=block',
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'deny',
      'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
      'x-aspnet-version': '',
      'x-aspnetmvc-version': ''
    },
    config: {
      url: 'https://api.scribesoft.com/v1/orgs/...',
      method: 'post',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'axios/0.19.2'
      },
      auth: { username: '...', password: '...' },
      transformRequest: [ [Function: transformRequest] ],
      transformResponse: [ [Function: transformResponse] ],
      timeout: 0,
      adapter: [Function: httpAdapter],
      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',
      maxContentLength: -1,
      validateStatus: [Function: validateStatus],
      data: undefined
    },
    request: ClientRequest {
      _events: [Object: null prototype] {
        socket: [Function],
        abort: [Function],
        aborted: [Function],
        error: [Function],
        timeout: [Function],
        prefinish: [Function: requestOnPrefinish]
      },
      _eventsCount: 6,
      _maxListeners: undefined,
      outputData: [],
      outputSize: 0,
      writable: true,
      _last: true,
      chunkedEncoding: false,
      shouldKeepAlive: false,
      useChunkedEncodingByDefault: true,
      sendDate: false,
      _removedConnection: false,
      _removedContLen: false,
      _removedTE: false,
      _contentLength: 0,
      _hasBody: true,
      _trailer: '',
      finished: true,
      _headerSent: true,
      socket: TLSSocket {
        _tlsOptions: [Object],
        _secureEstablished: true,
        _securePending: false,
        _newSessionPending: false,
        _controlReleased: true,
        _SNICallback: null,
        servername: 'api.scribesoft.com',
        alpnProtocol: false,
        authorized: true,
        authorizationError: null,
        encrypted: true,
        _events: [Object: null prototype],
        _eventsCount: 9,
        connecting: false,
        _hadError: false,
        _parent: null,
        _host: 'api.scribesoft.com',
        _readableState: [ReadableState],
        readable: true,
        _maxListeners: undefined,
        _writableState: [WritableState],
        writable: false,
        allowHalfOpen: false,
        _sockname: null,
        _pendingData: null,
        _pendingEncoding: '',
        server: undefined,
        _server: null,
        ssl: [TLSWrap],
        _requestCert: true,
        _rejectUnauthorized: true,
        parser: null,
        _httpMessage: [Circular],
        [Symbol(res)]: [TLSWrap],
        [Symbol(asyncId)]: 8,
        [Symbol(kHandle)]: [TLSWrap],
        [Symbol(lastWriteQueueSize)]: 0,
        [Symbol(timeout)]: null,
        [Symbol(kBuffer)]: null,
        [Symbol(kBufferCb)]: null,
        [Symbol(kBufferGen)]: null,
        [Symbol(kBytesRead)]: 0,
        [Symbol(kBytesWritten)]: 0,
        [Symbol(connect-options)]: [Object]
      },
      connection: TLSSocket {
        _tlsOptions: [Object],
        _secureEstablished: true,
        _securePending: false,
        _newSessionPending: false,
        _controlReleased: true,
        _SNICallback: null,
        servername: 'api.scribesoft.com',
        alpnProtocol: false,
        authorized: true,
        authorizationError: null,
        encrypted: true,
        _events: [Object: null prototype],
        _eventsCount: 9,
        connecting: false,
        _hadError: false,
        _parent: null,
        _host: 'api.scribesoft.com',
        _readableState: [ReadableState],
        readable: true,
        _maxListeners: undefined,
        _writableState: [WritableState],
        writable: false,
        allowHalfOpen: false,
        _sockname: null,
        _pendingData: null,
        _pendingEncoding: '',
        server: undefined,
        _server: null,
        ssl: [TLSWrap],
        _requestCert: true,
        _rejectUnauthorized: true,
        parser: null,
        _httpMessage: [Circular],
        [Symbol(res)]: [TLSWrap],
        [Symbol(asyncId)]: 8,
        [Symbol(kHandle)]: [TLSWrap],
        [Symbol(lastWriteQueueSize)]: 0,
        [Symbol(timeout)]: null,
        [Symbol(kBuffer)]: null,
        [Symbol(kBufferCb)]: null,
        [Symbol(kBufferGen)]: null,
        [Symbol(kBytesRead)]: 0,
        [Symbol(kBytesWritten)]: 0,
        [Symbol(connect-options)]: [Object]
      },
      _header: 'POST /v1/orgs/...' +
        'Accept: application/json, text/plain, */*\r\n' +
        'Content-Type: application/x-www-form-urlencoded\r\n' +
        'User-Agent: axios/0.19.2\r\n' +
        'Host: api.scribesoft.com\r\n' +
        'Authorization: Basic ...' +
        'Connection: close\r\n' +
        'Content-Length: 0\r\n' +
        '\r\n',
      _onPendingData: [Function: noopPendingOutput],
      agent: Agent {
        _events: [Object: null prototype],
        _eventsCount: 1,
        _maxListeners: undefined,
        defaultPort: 443,
        protocol: 'https:',
        options: [Object],
        requests: {},
        sockets: [Object],
        freeSockets: {},
        keepAliveMsecs: 1000,
        keepAlive: false,
        maxSockets: Infinity,
        maxFreeSockets: 256,
        maxCachedSessions: 100,
        _sessionCache: [Object]
      },
      socketPath: undefined,
      method: 'POST',
      path: '/v1/orgs/...',
      _ended: true,
      res: IncomingMessage {
        _readableState: [ReadableState],
        readable: false,
        _events: [Object: null prototype],
        _eventsCount: 3,
        _maxListeners: undefined,
        socket: [TLSSocket],
        connection: [TLSSocket],
        httpVersionMajor: 1,
        httpVersionMinor: 1,
        httpVersion: '1.1',
        complete: true,
        headers: [Object],
        rawHeaders: [Array],
        trailers: {},
        rawTrailers: [],
        aborted: false,
        upgrade: false,
        url: '',
        method: null,
        statusCode: 201,
        statusMessage: 'Created',
        client: [TLSSocket],
        _consuming: false,
        _dumped: false,
        req: [Circular],
        responseUrl: 'https://...',
        redirects: []
      },
      aborted: false,
      timeoutCb: null,
      upgradeOrConnect: false,
      parser: null,
      maxHeadersCount: null,
      _redirectable: Writable {
        _writableState: [WritableState],
        writable: true,
        _events: [Object: null prototype],
        _eventsCount: 2,
        _maxListeners: undefined,
        _options: [Object],
        _redirectCount: 0,
        _redirects: [],
        _requestBodyLength: 0,
        _requestBodyBuffers: [],
        _onNativeResponse: [Function],
        _currentRequest: [Circular],
        _currentUrl: 'https://...'
      },
      [Symbol(kNeedDrain)]: false,
      [Symbol(isCorked)]: false,
      [Symbol(kOutHeaders)]: [Object: null prototype] {
        accept: [Array],
        'content-type': [Array],
        'user-agent': [Array],
        host: [Array],
        authorization: [Array]
      }
    },
    data: {
      id: '1fbc7ee9-f1bd-46b0-b2b6-eaee37cf5542',
      name: 'TestConnection',
      reply: null,
      status: 'Requested'
    }
  }
  `