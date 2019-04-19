<template>
  <div :class="$style.search">
    <input ref="eIpt" v-model.trim="wd" type="text" placeholder="搜索" @blur="blur" @focus="focus">
    <div v-show="show" :class="$style.result" @mousedown="$event.preventDefault()">
      <table>
        <tr v-for="item of searchResult" :key="item.id" @click="select(item)">
          <th>{{ item.name }}</th>
          <td>
            <div :class="$style.tit" v-html="JSON.parse(item.highlightPath).join('/')"></div>
            <pre v-html="item.content" />
          </td>
        </tr>
      </table>
      <div v-show="noData" :class="$style.noData">- 找不到结果 -</div>
      <ScrollBottomLoadPage
        ref="vScrollBottomLoadPage"
        :class="$style.loaderBottom"
        :first-load="false"
        :start-page="0"
        @load="load"
      />
      <div :class="$style.algoliaLogoBox">
        <a :class="$style.algoliaLogo" href="https://www.algolia.com"></a>
      </div>
    </div>
  </div>
</template>

<script>
import dataApi from './data-api.js'
import ScrollBottomLoadPage from './scroll-bottom-load/ScrollBottomLoadPage.vue'
export default {
  components: {
    ScrollBottomLoadPage
  },
  data () {
    return {
      show: false,
      wd: '',
      searchResult: [],
      noData: false
    }
  },
  // computed: {
  //   show () {
  //     return this.searchResult.length > 0
  //   }
  // },
  watch: {
    async wd (wd) {
      if (wd) {
        this.show = true
        this.noData = false
        this.$refs.vScrollBottomLoadPage.reload()
      } else {
        this.show = false
        this.noData = true
        this.searchResult = []
        this.$refs.vScrollBottomLoadPage.close()
      }
    }
  },
  methods: {
    capture (path, content) {
      let { wd } = this
      wd = wd.replace(/[\x5E\x24\x2A\x2B\x3F\x2E\x28\x29\x3A\x3D\x21\x7C\x7B\x7D\x2C\x5C\x5B\x5D]/g, '\\$&') // 转义正则符号
      wd = wd.replace(/\s+/g, '[\\d\\D]*?')
      let reg = new RegExp(`(.{0,20})(${wd})(.{0,20})`, 'i')
      let res = path.match(reg)
      if (!res) {
        res = content.match(reg)
      }
      if (!res) {
        return content.substr(0, 20)
      }
      let real = res[2]
      let realEnd = ''
      let endIndex = real.length - 20
      if (endIndex > 0) {
        if (endIndex < 20) {
          endIndex = 20
        }
        realEnd = '...' + real.substr(endIndex)
      }
      return `${res[1]}<b>${real.substr(0, 20)}${realEnd}</b>${res[3]}`
    },
    blur () {
      this.show = false
    },
    focus () {
      if (this.wd) {
        this.show = true
      }
    },
    select (d) {
      this.$emit('select', d)
      this.$refs.eIpt.blur()
    },
    async load ({ complete, page }) {
      let searchResult = []
      try {
        searchResult = await dataApi.search(this.wd.replace(/\s+/g, ' '), page)
        searchResult = searchResult.map(d => {
          return {
            id: d.objectID,
            name: d.name,
            path: d.outline,
            highlightPath: d._highlightResult.outline.value,
            content: d._highlightResult.content.value
          }
        })
        if (page === 0) {
          this.searchResult = searchResult
        } else {
          this.searchResult = this.searchResult.concat(searchResult)
        }
      } catch (err) {
        console.error(err)
      }
      let noNextPage = searchResult.length === 0
      if (noNextPage && page === 0) {
        this.noData = true
        this.$refs.vScrollBottomLoadPage.hide()
      }
      complete(noNextPage)
    }
  }
}
</script>

<style module>
.search {
  padding: 4px;
  height: 28px;
  input {
    height: 28px;
    box-sizing: border-box;
    width: 100%;
    padding: 4px;
    outline: none;
  }
}
.result {
  background-color: #fff;
  position: fixed;
  margin-top: -1px;
  max-height: 80%;
  /* max-width: 100%; */
  overflow: auto;
  /* top: -1px; */
  z-index: 3;
  border: 1px solid #d1d5da;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.12);
  table {border-collapse: collapse;}
  tr {
    /* border-bottom: 2px solid blue; */
    border-bottom: 1px solid #e1e4e8;
    /* padding: 6px 0; */
    /* position: relative; */
    /* display: flex; */
    line-height: 1.4;
  }

  th {
    padding: 6px;
    background-color: #f1f1f1;
    border-bottom: 1px solid #e1e4e8;

    width: 100px;
    box-sizing: border-box;
    word-wrap: break-word;
    word-break: break-all;
  }
  td {
    padding: 6px;
    word-wrap: break-word;
    word-break: break-all;
  }
  tr:hover th,
  tr:hover td {
    background-color: #f9ffde;
  }

  .tit {
    font-weight: bold;
    padding: 2px 0 8px;
    /* font-size: 14px; */
  }
  pre {
    margin: 0;
    color:#333;font:14px/1.2 "Microsoft Yahei",Consolas;
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-wrap;
  }
  em {
    background: #ffe564;
  }
}

.noData {
  text-align: center;
  padding: 20px 0 2px;
}
.loaderBottom {
  padding: 8px 12px!important;
}
.algoliaLogoBox {
  padding: 6px 10px;
  margin: 0 4px;
  border-top: 1px solid #ddd;
  text-align: right;
}
.algoliaLogo {
    display: inline-block!important;
    width: 111px;
    height: 15px;
    text-indent: 101%;
    overflow: hidden;
    white-space: nowrap;
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKgAAAAYCAYAAABugbbBAAAAAXNSR0IArs4c6QAAEKlJREFUaAXtWwl4VNUVPvfNJCEgkICsIoIbKOCGYrVUaW1L7efWyrCaRUwmK0gUKlYt+dSqoKA2zIQkQEiQCgm2pYi2bqB1QdsqKpsKEtGEkIUtM1lm5r3b/7zJSybDZDKTxBYr5+Plvnvvuedu/z3n3PMGQaepUyuQnS2VXQ3Uu1ONmxv1UMmz9inh7IqMYG15jNnZQgvG823UWUqkqXSqULtDtugOId8nGZYsGU2N9AzmPEtK6tXVuWMD9itE8zasEC92VRa3n5omb5NEv8XYRpsUumGDXfyzO+R2JGNamvwBELlUoF/0n7FxhVjfUZtQ6rE2pymsFWigx7H51u4AJ/eLzTxPFbRxRqYcHdY42mcehbFdheouaff2xQeu0QQNw2SuxXz6+XNY0uQtU1Jl/vR0ea1/XUf50wDtaIX86wVZ/Iu6nJcU5dboli7LOQUFWNLlYID2BQwtWdVoM7sd4QzTHA7zaV6sgKQBHa3DhecSzbyVKDKCyO0h2rCZaPcXwVth1wYG5/iO1poInjYeIjMJci1aRDI7O/S5hIXm0MV2nTPp7oJBccm5k9PS7LGhSotLt13EbULl/7b4rv8BEYO0bx/Y73OIJl3zbfV06sstzRHV8LMnA5yLyUQ/FwJeahika1AppUi02ixoOQvPMCHFUQh6vagg/fEwZHUrq7veM5GkurHBrVwHwf8IRbhwU7qUaiZ4/6uXv0suIrrqEqLSLUQnHF6Nuf1Doj5nENU5iQ6WhzL60Hni5ste551BDV29obOcRpW00qdFQ0e9M0amZtCgMQOpKtx+S3PFm5D/Ji6YJ/mn3K/lPtnXVEd91ElU4X/71wGakGJfBMd6EQlRg519B9vbX5PaA2j7PwMoD/y7QFGRRPelEVXXEr34OtHPcJx+BR3O5QZ5YOBe3kr0/CavyTfKw0nhy90tNUoVgs5pcFD0Tic1WVLlfuTXxVxGT+an4HiGQInzZEx9Ez0MRWSBnMHcBHKOIzmI59+k0LOldrGDy5lmpMlL4KUsnZpOE4CRPrsOkxOXno+EiRaWLBfveLmC/wX/q2h7NTXQTnDqF6U5c2RUpZuwKnQ5eu+BPki8QW6MZS/w9yBA/VeWauaTkWC1z0Ph7mhhviw/P0Wf6OzMVUOZwZdKSkpMW147OqJfr9iKp5+e2ubUsZykTNtw6THHiJ7mr1c9nXTEaGu15kUoihYbEXHO8ZycXzbFW/OGF+en8ILoxHL/trXmfDJF1a1efleFUe6bJqbmjjBFR5zwletb7/+enb3VXHbos5Ejhow6kJ39Y54/ZWeXRFZW1sZomuLAPOuNNkZ5dHT/Ov95GTztpU0uorc/INoMcGYleU16YxPRx7uJvqkkGgLPctR5RDf/lOiKsUSP/IGo9mh70oKUSxqO2tHYaC/hYoXXi5H//ZEdNB6Ft3MFbtOSQwOBaHqGvNrRSH9G3RDferD3RX4cPzDA7yHVAQqwxHkkrUR9y3FDfxxamwiv8i0AbwGAtAx5QrS1ZWic9yW0h31pG1XIyRF8wEahrofBi3d47RiHpE1TM+S0EpsoUebOfRmdy94w6w15eVZ9I7mBP1ASrLasF1+tPqFp7n21jipHfJLdzhvLvAyw+GT7PlcTlblVzw5XXWNtfJJtLZdzvUvRfuj0qIePNR3IRPlBKT36AngPhy1r8ytVx91uba+7saE8Pmn5u9zGIKz2hXFJtjLVox5wOxqr4622bKPOP5WYBJfFW+0z93+z65iqej7/snz38YQku5XLy6qq+9Wr2jcN0r2K8wYdKK+ey+OrbajtVKgn9zmv1mR/c9fnAOrDRI/mEH26l+jrCqLHlhP982Ois6Cv0uKMXsNMJW2BEpmL2OZks5muUgTFYbJluhRJv2ZNx++KBFcAYo2FW3QRqhicUij0hMlE46GBR0Nr3uffZHqmHArA2PBEQuBx9JcYYaaL0I6jGIeARgVAesIIj+FuHrBflouKgHWQtRDPjREmGisiaIyi0AIw6gpSqvQgtzXrGi3ZthlAuBWadMvslBX3r85LxXK2Em+4pmnL4Jc+ZVIiVknNMwEHZs2BiuoycC3ZvXuAUET1Kxjy85oJTrFbJgF892x5veYN1BcaknDKFknIUJpPaGKKfYGmycWQu9EklVwptDpYw8uYX0roAk6x1xC+EJlDmpSPk0a/w2Vow1p7xh6uD0Rou9gkTElwyitVVX0Ic8uDBv58jT1tW1yy7S/A8W18+crNTdd1GeYyAxv1afGKtI8Cyeuo7BLA+rqriQ7XED1hJ2INyjR0ENGtPye64YdezXlmLNGl8FeZ9633vTyh/i1dAQNIxI9B/0JQvhJAeZULPEKPfX7SngaFOZ2NtRzV3PgZmPH7DUGQ86FmZJpTTaWFeNVjqVibxJJc8Zfmqr3T0uVXAPsHkBcB9yUb5dM70KBgPZlK7KLAr3T3lDQ5FpueAEiPseZJnAmQObZHnOdIQw4mGw8NeCM01ubIKDlnlS3zK12AJucDIB8UF2QsaBa4Nz7ZlgyfaDryS5pNKDwxL2HzH3W45d2kyQkoKTTK2V8qLkiHfoGWySqJrnVULwI4t0Iun0qD9C8fQijAOOBKcllxfkYRVyYkL48BmDaQR4GxpJMACuBhCpJMikhfk5eG4A5R4rzCHarT+ZWmqlnIbjNLZQWiHhanh2Ygb09MWXEBNO0VUhHzmb8zNJFnCeJLkgFOb4n3LwZFw+Ew/RFe1QOZsI9Xhg9QlqR/Xq2hMTikZ/E0IdZh9IO9GGa8B0rB+yOjHLueb7y3l2LMV+h1gmo32GlTSW4rJ3+dgnn+FDLZHGM2wQnYaffqPmuOHObx0DjIGghZDhwUfU7oXznxMQ3WAbp6yV116CIRmmmxcCv3QwPFuZtofGK6bXyhLf0wNCufvIMwv2tahiKpP8ADD8tLMKPjgY/Z6GSEw6PBr4AzJGUfo15PJb1l5Gvqj4wBQ08SSolRFjAVSotW0xTzl6R6cJejqEC8uonHTCOluaWfNc/ceQxuxQ4MB7oLp2Vl2hs4gJ+h7wRk7bAG0zBW1WSmdYFkhlLGmpLpiwPe1Phbh6XmGChfnhi4vXp6awx+gy+UFFouYVelfrkZHogfJljfy0B1zWVDOMXaab3H0f4gfEaVrm0BrjIoEayqHwnIkACooJHWbNnzWKVfvU8WjU9qz5c1ZxMVuTx0E4Oxhd2XMxK6pqUCL2w2oeHiSREPgm+odInbeXDQSh7cgQRm52p96G0MbiW3h184URPadgxjItjfg/Z7HmmLP6uqEAGCqW7glMkMe84pYNxmDFzmS/CpsLWhEWvQZk52tv3IOwYuhK+TB8YJida80ZoU07AJf19jzwiyxH6iQsxu20608aVWrYp+OkW4wU/RJBVizMOxYMfwlGLR8iAP0kMjBiZzYhUU1yE4Px0QvHkD8IGVAQIVhjxPfXB5GOdJU3c20iaM5RYeDyrfwnyWYIxPgrNFIbF8fRB3Za3s1+Z2LKSXSZGR+jwkfQjAnd3/jIF3B7zlSpoCcJpNJtOMwrzU3TCrMTCrucaoTCYhoPjaUEyv2D01dVVOFOqmtk1lJzOGBm2SnskQoWtEDvg3OZvG43S9bIg194oqctc1PaZJ92MoG4uFecSo60xaDmiPOhfB+ZFEFYfbl3A+6pnKg/B4Odr+hfnOQAl0BTkizTRuXY74hjlmpslYl6Qjbblbczj63v3zFrUcwIYq4pHsMTj1Cw57Uz6Eo74HB+IaFJ03+zey9+olgq2sTvxrJfmGfuvHoKiC66amGroBLG37bW7VmsycKy9wueg6vURQESIBiUYtRwYg6XIjb+ab9uZXqw7ApywGendCUw4jTUvEewOApZ9QM25bqqR3axzVWxOSbM9CmVYLoV1M0lReVJD2Ak7b16zEVc2TisvInzRnvZUBa3QSKGWg4+b/O7gTS+OTl28iMhUgVuHEwowvKsh4KlCbUMugKpbFJdkHKEKrcDldcPZFTxiLJ432fBhxWSrBGONxiI716XEu+u88vQ2v+SfXIp54E9F2HO1AfijbKv78yfQPhKXCpDN0fklqr7EUHN6Sqg3ZAPYkvL/DeWwP9DnN5HdccJKR3MPv7RFAWwSdew00XLTDgRg50fwW3m0ET9rr80LuWi4HBmq4EyZYvUlIivk9EKmuVhcN6x/UQpotFov24iu2P0NQAnxGvrVxoOITmMHE1bnpn3EHhfmZ79+ZbPsRDtlSaKlC8EWBq0KaVJ4omYb2tGnl9RPwmopbcwIAsQpHq4rtSTCCO7EM7oETbA/jq9EtkOkC+PlQdAqgrZckStBUmQ+zeDZOeDlO9BTc0NvAwiTFSpVkPNTSeo5kBBtnR3UcTnoT28+fOBemIzZThMC9j17ri1VNvYNo5NlEH+1C3BSADocwh4+xRldiNfse+YjehZZ5CXt0ENpziL+ciEh6ydNE0Ccwuxo9CN5+0FD39htEq45W0nyUD0ebLNyWxwBIb+PWPwh8t/vLGTuQCnYephTsyeWaRveCfxzAtB3txwL4v2Z+1p4Yx6P8PmYQvQP+WvDjIw8lwmc2DTKTleOdXO9LAyPoC0QVjvN8MK9kjPEc1L/PYEWerV8LoayV2DTHil5NAc14Mxtr3NdeOxrlG+g2JHBwfNGiSSr7rUZZqCmb4t5K3xPB+g5VlsE3Z85zfXJy7jhh5H1ThM6WkNTuxZXqouIC6+e+dcHecXsFLvSAchu2ntFED80lOn8EVtlF9Nn+5kD9AG+gnuu/PoSY2bNER463aapnoBCWIuzSqqV8WO6YJ4c0NhIfsGE+xW1e4cg9ilDQQ1wIn/UBgEgHDgBUuzFXnMnl09MkK5n1AMFQzgcigC4FgM7nOkumHIkfeqzDfK8JwLsXcdRZG2ziQ6NuSrqchZtFEfh1H1f0pZjSxeI4wH0YwB0IsL2HcNm1uuwM+SsEaV7AexsMGrI4Nfegke1W+jL+P71DY7NWgLGVk7GQi9cWZP42nPm1B1CWwd7+rTj/t9/Y9lOnG6HnLVu9N3qEVAJSMIByA8scOQDXzhR0cT3GPxQmFf/oKKpYV++DC1Gy3ibeZ14mfDW6AZovHu5OPwD0Zm8p5OC7N7zJ2dByl6J9P4B1H+r4yGQzD8YxEwfleX5nYn+TtlEitOwvkD0La1YFSG0TPSgv0Dd8BPiv1DyUhH5HIQh/M+KtDvwW9DX0FYv2nwCgd7JcJg7yI47KVpi/KJ2JeTl4TpjYYXhEe2IGUSHy3y+Cv/sn+DDDoCmKi/LSbeFq+2AANVaSf2bHmpRNO/9YZF9ZYL/U4Oe0I4D68nb3Oy44cwEo6HZoLXylWr9c/Ku7++isvKAXmc4KPZXbFRdk6v4TjxEfAMIfqoBTL0828b6CXNCYHf3+05ef36HRTvLV/Hm6mmdtWGLB53ofF2zaHHmp6qYFLBuH1oELFDzqU4e+dwDt6tLDJLJ2mdRVOf7tYdLCvDr5S+g4j4+lt1m20jr4hOUwnfWYS3+AczBa6pYUN4cH4Mfi88KpQ1iX0xTOCsCvysJu1oTTpiNeyNvInxM74utqPUJHV0L7cwTmXIBzLORxFACKE/MRlHXxYFre1T66u71+crpb6P+7vBn3yjM9TroRG84b3GmCxvIALDuafwjSaTmhNuTPi40uuhj3tPPRb18gs8okqCwimnZ+m//9OdTxBeL7D+PNyZgZJdixAAAAAElFTkSuQmCC");
    background-repeat: no-repeat;
    background-size: contain;
    vertical-align: middle;
    padding: 0!important;
}
</style>
