# payments/admin.py
from django.contrib import admin
from django.utils.html import format_html
from django.shortcuts import redirect
from django.urls import path
from django.http import HttpResponseRedirect
from .models import Payment

def approve_payment(modeladmin, request, queryset):
    """Admin action to approve selected payments and update order status"""
    for payment in queryset:
        payment.status = 'approved'
        payment.save()
        # Update order status to 'paid'
        payment.order.status = 'paid'
        payment.order.save(update_fields=['status'])
    modeladmin.message_user(request, f"{queryset.count()} payment(s) approved. Order status updated to 'paid'.")

approve_payment.short_description = "✓ Approve selected payments"


def reject_payment(modeladmin, request, queryset):
    """Admin action to reject selected payments and update order status"""
    for payment in queryset:
        payment.status = 'rejected'
        payment.save()
        # Update order status to 'cancelled'
        payment.order.status = 'cancelled'
        payment.order.save(update_fields=['status'])
    modeladmin.message_user(request, f"{queryset.count()} payment(s) rejected. Order status updated to 'cancelled'.")

reject_payment.short_description = "✗ Reject selected payments"


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'user', 'status', 'uploaded_at', 'screenshot_preview', 'action_buttons')
    list_filter = ('status', 'uploaded_at')
    search_fields = ('order__id', 'user__email', 'status')
    readonly_fields = ('id', 'user', 'uploaded_at', 'screenshot_preview')
    fields = ('id', 'order', 'user', 'screenshot', 'screenshot_preview', 'status', 'uploaded_at')
    actions = [approve_payment, reject_payment]

    def screenshot_preview(self, obj):
        if obj.screenshot:
            return format_html(
                '<img src="{}" style="max-width: 300px; max-height: 300px;" />',
                obj.screenshot.url
            )
        return 'No screenshot'
    screenshot_preview.short_description = 'Screenshot Preview'

    def action_buttons(self, obj):
        """Display approve/reject buttons inline"""
        approve_url = f"javascript:if(confirm('Approve this payment?')){{fetch('/api/payments/{obj.id}/approve/', {{method:'POST',headers:{{'Authorization':'Bearer '+localStorage.getItem('token')}}}}).then(()=>location.reload());}}"
        reject_url = f"javascript:if(confirm('Reject this payment?')){{fetch('/api/payments/{obj.id}/reject/', {{method:'POST',headers:{{'Authorization':'Bearer '+localStorage.getItem('token')}}}}).then(()=>location.reload());}}"
        
        if obj.status == 'pending':
            return format_html(
                '<a class="button" style="background-color: #28a745; margin-right: 5px;" href="{}">Approve</a>'
                '<a class="button" style="background-color: #dc3545;" href="{}">Reject</a>',
                approve_url, reject_url
            )
        elif obj.status == 'approved':
            return format_html('<span style="color: green; font-weight: bold;">✓ Approved</span>')
        elif obj.status == 'rejected':
            return format_html('<span style="color: red; font-weight: bold;">✗ Rejected</span>')
        return obj.status
    action_buttons.short_description = 'Actions'
