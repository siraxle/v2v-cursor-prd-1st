import { NextRequest, NextResponse } from 'next/server';

// Mock subscription data
const mockSubscriptionData = {
  subscription: {
    id: 'sub_demo_12345',
    status: 'active',
    plan: 'professional',
    plan_name: 'Professional Plan',
    current_period_start: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    current_period_end: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    trial_end: null,
    cancel_at_period_end: false
  },
  usage: {
    current_period: {
      minutes_used: 180,
      minutes_included: 500,
      minutes_remaining: 320,
      sessions_completed: 24,
      overage_minutes: 0,
      overage_cost: 0
    },
    this_month: {
      total_sessions: 24,
      total_minutes: 180,
      average_session_length: 7.5,
      best_score: 4.5,
      average_score: 4.1,
      improvement_trend: '+12%'
    }
  },
  billing: {
    next_billing_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    amount_due: 2900, // cents
    currency: 'usd',
    payment_method: {
      type: 'card',
      last4: '4242',
      brand: 'visa'
    }
  },
  features: {
    voice_sessions: true,
    ai_analysis: true,
    advanced_metrics: true,
    team_management: false,
    priority_support: true,
    export_reports: true
  }
};

export async function GET(request: NextRequest) {
  try {
    // In production: Get user from auth header and fetch real data
    /*
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
    }
    
    const token = authHeader.replace('Bearer ', '');
    // Verify JWT token and get user data
    // Query salesai_subscriptions, salesai_usage tables
    // Integrate with Stripe API for billing data
    */

    // Demo mode: Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));

    // In production: Fetch from Stripe and Supabase
    /*
    const stripeSubscription = await stripe.subscriptions.retrieve(user.stripe_subscription_id);
    const usage = await supabase
      .from('salesai_usage')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', currentPeriodStart);
    */

    return NextResponse.json({
      success: true,
      data: mockSubscriptionData,
      message: 'Demo subscription data. In production, this would come from Stripe and Supabase.'
    });

  } catch (error) {
    console.error('Subscription data error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription data' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, plan_id } = body;

    // In production: Handle subscription updates
    /*
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
    }

    switch (action) {
      case 'upgrade':
        // Update Stripe subscription
        await stripe.subscriptions.update(user.stripe_subscription_id, {
          items: [{ price: plan_id }]
        });
        break;
      case 'cancel':
        // Cancel at period end
        await stripe.subscriptions.update(user.stripe_subscription_id, {
          cancel_at_period_end: true
        });
        break;
      case 'reactivate':
        // Remove cancellation
        await stripe.subscriptions.update(user.stripe_subscription_id, {
          cancel_at_period_end: false
        });
        break;
    }
    */

    // Demo mode: Return success
    return NextResponse.json({
      success: true,
      message: `Demo: Subscription ${action} would be processed in production with Stripe integration.`
    });

  } catch (error) {
    console.error('Subscription update error:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}
