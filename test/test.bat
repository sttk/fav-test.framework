@echo off

set CWD=%~d0%~p0

node %CWD%unit\callback.unit.js
node %CWD%unit\define.unit.js
node %CWD%unit\dont-twice.unit.js
node %CWD%unit\is-promise-like.unit.js
node %CWD%unit\run-async-by-callback.unit.js
node %CWD%unit\run-async-by-promise.unit.js
node %CWD%unit\run-async-sequentially.unit.js
node %CWD%unit\run-async-parallelly.unit.js

node %CWD%unit\event.test.js
node %CWD%unit\tree.test.js
node %CWD%unit\hook.test.js
node %CWD%unit\async.test.js
node %CWD%unit\retry.test.js
node %CWD%unit\timeout.test.js
node %CWD%unit\slow.test.js
node %CWD%unit\only.test.js
node %CWD%unit\skip.test.js

node %CWD%join\event.test.js
node %CWD%join\tree.test.js
node %CWD%join\hook.test.js
node %CWD%join\async.test.js
node %CWD%join\retry.test.js
node %CWD%join\timeout.test.js
node %CWD%join\slow.test.js
node %CWD%join\only.test.js
node %CWD%join\skip.test.js

