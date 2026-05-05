package in.forjitai.app;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.NetworkCapabilities;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private ProgressBar progressBar;
    private SwipeRefreshLayout swipeRefreshLayout;
    private LinearLayout offlineLayout;
    private LinearLayout splashLayout;

    private static final String TARGET_URL = "https://forjitai.in";

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Status bar dark background
        getWindow().setStatusBarColor(Color.parseColor("#0c0a09"));
        getWindow().getDecorView().setSystemUiVisibility(0);

        setContentView(R.layout.activity_main);

        splashLayout      = findViewById(R.id.splashLayout);
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout);
        webView           = findViewById(R.id.webView);
        progressBar       = findViewById(R.id.progressBar);
        offlineLayout     = findViewById(R.id.offlineLayout);

        // Swipe-to-refresh styling
        swipeRefreshLayout.setColorSchemeColors(Color.parseColor("#f59e0b"));
        swipeRefreshLayout.setProgressBackgroundColorSchemeColor(Color.parseColor("#1c1917"));
        swipeRefreshLayout.setOnRefreshListener(() -> {
            if (isNetworkAvailable()) {
                webView.reload();
            } else {
                swipeRefreshLayout.setRefreshing(false);
                showOffline();
            }
        });

        // WebView settings
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setUserAgentString(
            settings.getUserAgentString() + " ForjitAIApp/1.0"
        );

        // WebViewClient
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                progressBar.setVisibility(View.VISIBLE);
                offlineLayout.setVisibility(View.GONE);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                progressBar.setVisibility(View.GONE);
                swipeRefreshLayout.setRefreshing(false);
                // Hide splash after first load
                if (splashLayout.getVisibility() == View.VISIBLE) {
                    new Handler(Looper.getMainLooper()).postDelayed(() ->
                        splashLayout.animate()
                            .alpha(0f)
                            .setDuration(400)
                            .withEndAction(() -> splashLayout.setVisibility(View.GONE))
                            .start(), 300);
                }
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request,
                                        WebResourceError error) {
                if (request.isForMainFrame()) {
                    progressBar.setVisibility(View.GONE);
                    swipeRefreshLayout.setRefreshing(false);
                    showOffline();
                }
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                // Keep forjitai.in links inside WebView
                if (url.startsWith("https://forjitai.in") ||
                    url.startsWith("https://www.forjitai.in")) {
                    return false;
                }
                // Open external links in browser
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
                    return true;
                }
                return false;
            }
        });

        // Progress bar via WebChromeClient
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                progressBar.setProgress(newProgress);
                if (newProgress == 100) {
                    progressBar.setVisibility(View.GONE);
                }
            }
        });

        // Retry button
        findViewById(R.id.retryButton).setOnClickListener(v -> {
            if (isNetworkAvailable()) {
                offlineLayout.setVisibility(View.GONE);
                webView.reload();
            }
        });

        // Load URL or restore state
        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState);
        } else {
            if (isNetworkAvailable()) {
                webView.loadUrl(TARGET_URL);
            } else {
                splashLayout.setVisibility(View.GONE);
                showOffline();
            }
        }
    }

    private void showOffline() {
        offlineLayout.setVisibility(View.VISIBLE);
        webView.setVisibility(View.GONE);
        swipeRefreshLayout.setVisibility(View.GONE);
    }

    private boolean isNetworkAvailable() {
        ConnectivityManager cm = (ConnectivityManager)
            getSystemService(CONNECTIVITY_SERVICE);
        if (cm == null) return false;
        NetworkCapabilities caps = cm.getNetworkCapabilities(cm.getActiveNetwork());
        return caps != null && (
            caps.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) ||
            caps.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) ||
            caps.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET)
        );
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        webView.saveState(outState);
    }

    @Override
    protected void onResume() {
        super.onResume();
        webView.onResume();
        // Re-check network when app comes back to foreground
        if (offlineLayout.getVisibility() == View.VISIBLE && isNetworkAvailable()) {
            offlineLayout.setVisibility(View.GONE);
            webView.setVisibility(View.VISIBLE);
            swipeRefreshLayout.setVisibility(View.VISIBLE);
            webView.loadUrl(TARGET_URL);
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        webView.onPause();
    }
}
