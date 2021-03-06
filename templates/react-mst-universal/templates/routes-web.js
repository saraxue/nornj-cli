<#-template name="importLoadPage">
import load#{pageName | capitalize}# from 'bundle-loader?lazy&name=[name]!./src/web/pages/#{pageName}#/#{pageName}##{!exName ?: ('.jsx', exName)}#';
//{importLoadPage}//
</#-template>

<#-template name="loadPage">
load#{pageName | capitalize}#,
  //{loadPage}//
</#-template>

<#-template name="pageComponent">
/**
 * 页面#{pageName}#
 */
const #{pageName | capitalize}# = inject('store')(
  observer(({ store }) => (
    <PageWrap>
      <Bundle load={load#{pageName | capitalize}#} store={store} isPc loadBundles={loadBundles}>
        {(_#{pageName | capitalize}#) => {
          const #{pageName | capitalize}# = withRouter(_#{pageName | capitalize}#);
          return <#{pageName | capitalize}# />;
        }}
      </Bundle>
    </PageWrap>
  ))
);

//{pageComponent}//
</#-template>

<#-template name="route">
__extraComment__*/}
    <Route exact path="/#{pageName | capitalize}#" component={#{pageName | capitalize}#} />
    {/*//{route}//
</#-template>

<#-template name="clearRegex">
\{\/\*__extraComment__\*\/\}
</#-template>