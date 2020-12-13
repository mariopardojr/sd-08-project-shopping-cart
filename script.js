!(function e(t, n, r) {
  function c(i, o) {
    if (!n[i]) {
      if (!t[i]) {
        const s = typeof require === 'function' && require;
        if (!o && s) return s(i, !0);
        if (a) return a(i, !0);
        const m = new Error(`Cannot find module '${i}'`);
        throw ((m.code = 'MODULE_NOT_FOUND'), m);
      }
      const l = (n[i] = { exports: {} });
      t[i][0].call(
        l.exports,
        function (e) {
          return c(t[i][1][e] || e);
        },
        l,
        l.exports,
        e,
        t,
        n,
        r,
      );
    }
    return n[i].exports;
  }
  for (
    var a = typeof require === 'function' && require, i = 0;
    i < r.length;
    i++
  ) c(r[i]);
  return c;
}(
  {
    1: [
      function (e, t, n) {
        const r = () => {
          const e = document.createElement('div');
          (e.className = 'loading'),
          (e.innerText = 'Carregando...'),
          document.querySelector('.items').appendChild(e);
        };
        const c = () => {
          setTimeout(() => {
            document.querySelector('.loading').remove(),
            document
              .querySelectorAll('.item')
              .forEach(e => e.classList.remove('hidden'));
          }, 500);
        };
        const a = () => {
          const e = document.querySelectorAll('.cart__item');
          const t = { sum: 0 };
          e.forEach(e => {
            const n = e.innerHTML.split('PRICE: $');
            const r = n[n.length - 1];
            t.sum += parseFloat(r);
          }),
          (document.getElementById('cart_sum').innerHTML = `${t.sum}`),
          (document.getElementById(
            'cart_sum2',
          ).innerHTML = `Total: R$ ${t.sum.toFixed(2)}`);
        };
        const i = () => {
          localStorage.setItem(
            'card',
            document.getElementById('cart__items_list').innerHTML,
          );
        };
        const o = e => {
          e.target.remove(), i(), a();
        };
        const s = (e, t, n) => {
          const r = document.createElement(e);
          return (r.className = t), (r.innerText = n), r;
        };
        const m = (e, t, n, r) => {
          const c = document.createElement(e);
          return (
            (c.className = t),
            (c.innerText = n),
            c.addEventListener('click', () => {
              fetch(`https://api.mercadolibre.com/items/${r}`)
                .then(e => e.json())
                .then(e => {
                  const { id: t, title: n, price: r } = e;
                  return { sku: t, name: n, salePrice: r };
                })
                .then(e => {
                  document.querySelector('.cart__items').appendChild(
                    (({ sku: e, name: t, salePrice: n }) => {
                      const r = document.createElement('li');
                      return (
                        (r.className = 'cart__item'),
                        (r.innerText = `SKU: ${e} | NAME: ${t} | PRICE: $${n}`),
                        r.addEventListener('click', o),
                        r
                      );
                    })(e),
                  ),
                  i(),
                  a();
                })
                .catch(() => {
                  i(), a();
                });
            }),
            c
          );
        };
        const l = ({ sku: e, name: t }) => {
          const n = document.createElement('section');
          return (
            (n.className = 'item hidden'),
            n.appendChild(s('span', 'item__sku', e)),
            n.appendChild(s('span', 'item__title', t)),
            n.appendChild(
              (e => {
                const t = document.createElement('img');
                return (
                  (t.className = 'item__image'),
                  fetch(`https://api.mercadolibre.com/items/${e}`)
                    .then(e => e.json())
                    .then(e => e.pictures.map(e => e.url))
                    .then(e => {
                      t.src = e;
                    }),
                  t
                );
              })(e),
            ),
            n.appendChild(
              m('button', 'item__add', 'Adicionar ao carrinho!', e),
            ),
            n
          );
        };
        const d = () => {
          r();
          const e = document.querySelector('.items');
          (() => {
            const e = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
            const t = 'https://api.mercadolibre.com/items/';
            return {
              list: async () => {
                const t = await fetch(e);
                const n = await t.json();
                return await n.results.map(e => [e.id, e.title]);
              },
              info: async e => {
                const n = await fetch(`${t}${e}`);
                const r = await n.json();
                const { id: c, title: a, price: i } = await r;
                return { sku: c, name: a, salePrice: i };
              },
            };
          })()
            .list()
            .then(t => {
              t.forEach(t => {
                const [n, r] = t;
                e.appendChild(l({ sku: n, name: r }));
              });
            })
            .then(c());
        };
        document
          .getElementById('btnclearcart')
          .addEventListener('click', () => {
            document.querySelectorAll('.cart__item').forEach(e => {
              e.remove();
            }),
            i(),
            a();
          }),
        (window.onload = function () {
          d(),
          (() => {
            localStorage.getItem('card')
                  && (document.getElementById(
                    'cart__items_list',
                  ).innerHTML = localStorage.getItem('card'));
            document.querySelectorAll('.cart__item').forEach(e => {
              e.addEventListener('click', o);
            }),
            a();
          })(),
          a();
        });
      },
      {},
    ],
  },
  {},
  [1],
));
// # sourceMappingURL=app.min.js.map
