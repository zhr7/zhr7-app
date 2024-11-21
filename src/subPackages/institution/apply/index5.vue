<template>
    <view>
      <u-form label-width="250">
        <u-form-item label="银行通道编号">
            <u-input v-model="searchKeyword" @input="filterOptions" placeholder="输入关键字搜索"/>
            <u-select v-model="showSelect" :list="filteredOptions" @confirm="confirmOption" ></u-select>
      </u-form-item>
      </u-form>
    </view>
  </template>

<script>
export default {
  name: 'App',
  data() {
    return {
      searchKeyword: '',
      options: [], 
      filteredOptions: [],
      selectedOption: null,
      showSelect: false
    };
  },
  methods: {
    filterOptions() {
        if (this.searchKeyword.length === 0) {
            // 如果搜索关键字为空，清空过滤后的选项
            this.filteredOptions = [];
            this.showSelect = false; // 隐藏下拉框
            return;
        }
        const keyword = this.searchKeyword.toLowerCase();
        this.filteredOptions = this.options.filter(item => {
        return item.bankName.toLowerCase().includes(keyword);
      });
      this.filteredOptions = this.filteredOptions.map(item => {
        return {
          value: item.bankCode,
          label: item.bankName
        };
      })
      console.log(this.filteredOptions);
      this.showSelect = true; // 显示下拉框
    },
    confirmOption(e) {
      // 处理选中的值
      console.log(e[0]);
      this.showSelect = false; // 隐藏下拉框
      this.searchKeyword = e[0].label;
      //将e[0].value赋值给银行通道编号字段
    },
    searchBankInfo() {
            this.$u.api.v3.institution.apply.SearchBankInfo({
            "filter":"{}"
        }).then(res => {
            // console.log(res.items);
            this.options = res.items;
        });
    }
  },
  mounted() {
    this.searchBankInfo();
  }
}
</script>

<style scoped>

</style>