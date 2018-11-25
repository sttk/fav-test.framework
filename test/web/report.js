function report(fw) {

  'use strict';

  var escape = fav.text.escape.HtmlEntity;

  var article = document.createElement('article');
  document.body.appendChild(article);
  fw.dom = article;

  var h2 = document.createElement('h2');
  h2.textContent = fw.title;
  article.appendChild(h2);

  fw._total = 0;
  fw._passing = 0;
  fw._pending = 0;
  fw._failing = 0;

  fw.on('start', function(node) {
    if (node.type === 'suite') {
      node.dom = document.createElement('div');
      node.dom.className = 'suite';
      node.dom.innerHTML =
        '<div class="title">' + escape(String(node.title)) + '</div>';
      node._parent.dom.appendChild(node.dom);
      return;
    }

    if (node.type === 'test') {
      fw._total++;
      return;
    }
  });

  fw.on('succeed', function(node) {
    var duration = node.endTime - node.startTime;
    node.dom = document.createElement('div');
    node.dom.className = 'test succeed';
    node.dom.innerHTML =
      '<div class="title"><span class="judge ok">✓</span>' +
      escape(String(node.title)) +
      '<span class="duration' + 
      ((duration > node.slow) ? ' slow' :
       (duration > node.slow / 2) ? ' a-little-slow' : '') +
      '">(' + duration + 'ms)</span>' +
      '</div>';
    node._parent.dom.appendChild(node.dom);
    fw._passing++;
  });

  fw.on('error', function(node) {
    node.dom = document.createElement('div');
    node.dom.addEventListener('click', function(event) {
      var elm = event.currentTarget;
      elm = elm.querySelector('div.error-stack');
      elm.style.display = elm.offsetParent ? 'none' : 'block';
    });

    var prefix = '<div class="title"><span class="judge ng">×</span>';

    var suffix = '</div>' +
      '<div class="error-stack">' +
      escape(String(node.error.stack)) +
      '</div>';

    switch (node.type) {
      case 'before': {
        var text = '"before all" hook';
        if (node.title) {
          text += ': ' + node.title;
        }
        text += ' for ' + node.node.title;
        node.dom.innerHTML = prefix + text + suffix;
        node.dom.className = 'suite error';
        node.node.dom.appendChild(node.dom);
        break;
      }
      case 'after': {
        var text = '"after all" hook';
        if (node.title) {
          text += ': ' + node.title;
        }
        text += ' for ' + node.node.title;
        node.dom.innerHTML = prefix + text + suffix;
        node.dom.className = 'suite error';
        node.node.dom.appendChild(node.dom);
        break;
      }
      case 'beforeEach': {
        var text = '"before each" hook';
        if (node.title) {
          text += ': ' + node.title;
        }
        text += ' for ' + node.node.title;
        node.dom.innerHTML = prefix + text + suffix;
        node.dom.className = 'test error';
        node.node._parent.dom.appendChild(node.dom);
        break;
      }
      case 'afterEach': {
        var text = '"after each" hook';
        if (node.title) {
          text += ': ' + node.title;
        }
        text += ' for ' + node.node.title;
        node.dom.innerHTML = prefix + text + suffix;
        node.dom.className = 'test error';
        node.node._parent.dom.appendChild(node.dom);
        break;
      }
      case 'test': {
        var duration = node.endTime - node.startTime || '?';
        var text = escape(String(node.title));
        text += '<span class="duration">(' + duration + 'ms)</span>';
        node.dom.innerHTML = prefix + text + suffix;
        node.dom.className = 'test error';
        node._parent.dom.appendChild(node.dom);
        break;
      }
    }
    fw._failing++;
  });

  fw.on('skip', function(node) {
    node.dom = document.createElement('div');
    node.dom.className = 'test skip';
    node.dom.innerHTML =
      '<div class="title"><span class="judge">-</span>' +
      escape(String(node.title)) +
      '</div>';
    node._parent.dom.appendChild(node.dom);
    fw._pending++;
  });

  function printResult() {
    var resultDiv = document.createElement('div');
    resultDiv.className = 'result';
    fw.dom.appendChild(resultDiv);

    var passingDiv = document.createElement('div');
    passingDiv.className = 'passing';
    passingDiv.textContent = fw._passing + ' passing';
    resultDiv.appendChild(passingDiv);

    if (fw._pending) {
      var pendingDiv = document.createElement('div');
      pendingDiv.className = 'pending';
      pendingDiv.textContent = fw._pending + ' pending';
      resultDiv.appendChild(pendingDiv);
    }

    if (fw._failing) {
      var failingDiv = document.createElement('div');
      failingDiv.className = 'failing';
      failingDiv.textContent = fw._failing + ' failing';
      resultDiv.appendChild(failingDiv);
    }
  }

  return function() {
    setTimeout(printResult, 0);
  };
}
