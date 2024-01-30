<script>
export default {
	onLaunch: function () {
		console.log('App Launch')
	},
	onShow: function () {
		console.log('App Show')
	},
	onHide: function () {
		console.log('App Hide')
	},
	created: function () {
		console.log("App created");
		this.$store.commit("initHistoryDeviceList");
	},
}
</script>

<style lang="scss">
/*每个页面公共css */
//#ifdef MP-WEIXIN
@import "wxcomponents/vant/common/index.wxss";
//#endif
@import "static/css/common.css";
</style>
